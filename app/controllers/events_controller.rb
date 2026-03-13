class EventsController < ApplicationController
  before_action :set_event, only: %i[ show edit update destroy ]

  # GET /
  def root
    @event = Event.current
    @locale = Location.pick(:locale) || "en_US"
    @judges = Person.includes(:judge).where(type: "Judge").by_name
    @djs    = Person.where(type: "DJ").by_name
    @emcees = Person.where(type: "Emcee").by_name

    if @djs.empty? && !@emcees.empty?
      @djs, @emcees = @emcees, []
    end

    @heats = Heat.where.not(number: ..0).distinct.count(:number)
    @unscheduled = Heat.where(number: 0).count
  end

  # GET /events/summary
  def summary
    people = Person.includes(:level, :age, :lead_entries, :follow_entries,
      options: :option, package: { package_includes: :option })
      .where.not(id: 0).to_a

    people_by_type = people.group_by(&:type)

    all_billables = Billable.where.not(type: "Option").ordered.to_a
    package_counts = {}
    all_billables.each do |billable|
      package_counts[billable.type] ||= {}
      package_counts[billable.type][billable.id] = { billable: billable, count: 0 }
    end

    option_billables = Billable.where(type: "Option").ordered.to_a
    option_counts = {}
    option_billables.each do |option|
      option_counts[option.id] = { billable: option, count: 0 }
    end

    people.each do |person|
      person_options = person.options

      if person.package_id && package_counts[person.type]
        pkg = package_counts[person.type][person.package_id]
        pkg[:count] += 1 if pkg
        person.package&.package_includes&.each do |pi|
          opt = option_counts[pi.option_id]
          opt[:count] += 1 if opt && !person_options.any? { |po| po.option_id == pi.option_id }
        end
      end

      person_options.each do |po|
        opt = option_counts[po.option_id]
        opt[:count] += 1 if opt
      end
    end

    @multi = Dance.where.not(multi_category: nil).count
    @pro_heats = Event.current.pro_heats
    @track_ages = Event.current.track_ages
    @has_questions = Question.exists?

    @people_by_type = people_by_type

    @package_summary = []
    package_counts.keys.each do |type|
      entries = []
      package_counts[type].values.each do |entry|
        entries.push({ name: entry[:billable].name, count: entry[:count] }) if entry[:count] > 0
      end
      @package_summary.push({ type: type, packages: entries }) if entries.length > 0
    end

    @option_summary = []
    option_counts.values.each do |entry|
      @option_summary.push({ name: entry[:billable].name, count: entry[:count] }) if entry[:count] > 0
    end

    students = people_by_type["Student"] || []
    @level_summary = []
    if students.length > 0
      level_counts = {}
      students.each do |person|
        level = person.level || Level.first
        level_counts[level.id] ||= { level: level, count: 0 }
        level_counts[level.id][:count] += 1
      end
      level_counts.values.sort_by { |e| e[:level].name }.each do |entry|
        @level_summary.push({ id: entry[:level].id, name: entry[:level].name, count: entry[:count] })
      end
    end

    @age_summary = []
    if students.length > 0 && @track_ages
      age_counts = {}
      students.select { |person| person.age }.each do |person|
        age_counts[person.age.id] ||= { age: person.age, count: 0 }
        age_counts[person.age.id][:count] += 1
      end
      age_counts.values.sort_by { |e| e[:age].category }.each do |entry|
        @age_summary.push({ id: entry[:age].id, category: entry[:age].category, description: entry[:age].description, count: entry[:count] })
      end
    end

    heats = Heat.includes(entry: [ :lead, :follow ]).to_a
    studio_counts = {}
    heats.each do |heat|
      name = heat.subject.studio.name
      studio_counts[name] ||= 0
      studio_counts[name] += 1
    end
    @heats_by_studio = studio_counts.keys
      .sort_by { |name| -studio_counts[name] }
      .map { |name| [ name, studio_counts[name] ] }
  end

  # GET /events/settings
  def settings
    @event = Event.current
  end

  # GET /events or /events.json
  def index
    @events = Event.all
  end

  # GET /events/1 or /events/1.json
  def show
  end

  # GET /events/new
  def new
    @event = Event.new
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events or /events.json
  def create
    @event = Event.new(event_params)

    respond_to do |format|
      if @event.save
        format.html { redirect_to @event, notice: "Event was successfully created." }
        format.json { render :show, status: :created, location: @event }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /events/1 or /events/1.json
  def update
    respond_to do |format|
      if @event.update(event_params)
        if params[:from_settings]
          format.html { redirect_to settings_events_path, notice: "Settings were successfully updated." }
        else
          format.html { redirect_to @event, notice: "Event was successfully updated.", status: :see_other }
        end
        format.json { render :show, status: :ok, location: @event }
      else
        if params[:from_settings]
          format.html { render :settings, status: :unprocessable_entity }
        else
          format.html { render :edit, status: :unprocessable_entity }
        end
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1 or /events/1.json
  def destroy
    @event.destroy!

    respond_to do |format|
      format.html { redirect_to events_path, notice: "Event was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      @event = Event.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def event_params
      params.expect(event: [ :name, :date, :location, :email, :heat_cost, :solo_cost, :multi_cost, :pro_heat_cost, :pro_solo_cost, :pro_multi_cost, :heat_length, :solo_length, :dance_limit, :ballrooms, :max_heat_size, :current_heat, :table_size, :heat_range_cat, :heat_range_level, :heat_range_age, :column_order, :assign_judges, :solo_level_id, :backnums, :locked, :include_open, :include_closed, :include_times, :intermix, :package_required, :partnerless_entries, :independent_instructors, :pro_heats, :print_studio_heats, :judge_comments, :judge_recordings, :track_ages, :agenda_based_entries, :strict_scoring, :student_judge_assignments, :open_scoring, :closed_scoring, :solo_scoring, :multi_scoring, :heat_order, :pro_am, :proam_studio_invoice, :finalist, :payment_due, :theme, :font_family, :font_size, :counter_color, :student_package_description, :studio_formation_cost ])
    end
end
