class PeopleController < ApplicationController
  before_action :set_person, only: %i[ show edit update destroy ]

  # GET /people
  def index
    @event = Event.current
    @track_ages = @event.track_ages
    @people ||= Person.includes(:studio, :level, :age).order(sort_order)
  end

  # GET /people/students
  def students
    @event = Event.current
    @track_ages = @event.track_ages
    @people = Person.includes(:studio, :level, :age).where(type: "Student").order(sort_order)
    @title = "Students"
    render :index
  end

  # GET /people/backs
  def backs
    leaders = Entry.joins(:heats).where.not(heats: { category: "Solo" }).distinct.pluck(:lead_id)
    @people = Person.where(id: leaders)
      .or(Person.where.not(back: nil)).includes(:lead_entries, :studio).order(:back, :type, :name)

    @pro_numbers = Person.where(type: "Professional").minimum(:back)
    @student_numbers = Person.where(type: "Student").minimum(:back)
  end

  # POST /people/backs
  def assign_backs
    leaders = Entry.joins(:heats).where.not(heats: { category: "Solo" }).distinct.pluck(:lead_id)
    people = Person.where(id: leaders).order(:name)

    pro_numbers = (params[:pro_numbers] || 101).to_i
    student_numbers = (params[:student_numbers] || 201).to_i

    Person.where.not(back: nil).where.not(id: leaders).update_all(back: nil)

    people.each do |person|
      if person.type == "Student"
        person.back = student_numbers
        student_numbers += 1
      else
        person.back = pro_numbers
        pro_numbers += 1
      end

      person.save! validate: false
    end

    redirect_to backs_people_path
  end

  # GET /people/1
  def show
    @event = Event.current
    @track_ages = @event.track_ages
  end

  # GET /people/new
  def new
    @person = Person.new
    if params[:studio]
      @person.studio_id = params[:studio].to_i
    end
    setup_form
  end

  # GET /people/1/edit
  def edit
    setup_form
  end

  # POST /people
  def create
    @person = Person.new(person_params)

    respond_to do |format|
      if @person.save
        redirect_path = @person.studio ? studio_path(@person.studio) : person_path(@person)
        format.html { redirect_to redirect_path, notice: "Person was successfully created." }
        format.json { render :show, status: :created, location: @person }
      else
        setup_form
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @person.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /people/1
  def update
    respond_to do |format|
      if @person.update(person_params)
        redirect_path = @person.studio ? studio_path(@person.studio) : person_path(@person)
        format.html { redirect_to redirect_path, notice: "Person was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @person }
      else
        setup_form
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @person.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /people/1
  def destroy
    redirect_path = @person.studio ? studio_path(@person.studio) : people_path
    @person.destroy!

    respond_to do |format|
      format.html { redirect_to redirect_path, notice: "Person was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person
      @person = Person.includes(:studio, :level, :age, :exclude).find(params.expect(:id))
    end

    # Set up form data for new/edit/create/update actions.
    def setup_form
      @event = Event.current
      @track_ages = @event.track_ages
      @locked = @event.locked
      @studios = Studio.order(:name).map { |s| [ s.name, s.id ] }
      @types = @person.studio ? %w[Student Professional Guest Franchisee] : %w[Judge Emcee DJ]
      @levels = Level.order(:id).map { |l| [ l.name, l.id ] }
      @ages = Age.order(:id).map { |a| [ "#{a.category} (#{a.description})", a.id ] }
      @roles = %w[Follower Leader Both]
      @exclude = @person.studio ? Person.where(studio_id: @person.studio_id).where.not(id: @person.id).order(:name).map { |p| [ p.display_name, p.id ] } : []
      @tables = Table.exists? ? Table.order(:number).map { |t| [ "Table #{t.number}", t.id ] } : nil
      @include_independent_instructors = @event.independent_instructors
    end

    def sort_order
      order = params[:sort] || "name"
      order = "studios.name" if order == "studio"
      order = "age_id" if order == "age"
      order = "level_id" if order == "level"
      order
    end

    # Only allow a list of trusted parameters through.
    def person_params
      params.expect(person: [ :name, :type, :role, :back, :available, :independent, :studio_id, :level_id, :age_id, :exclude_id, :invoice_to_id, :package_id, :table_id ])
    end
end
