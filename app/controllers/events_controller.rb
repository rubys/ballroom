class EventsController < ApplicationController
  before_action :set_event, only: %i[ show edit update destroy ]

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
        format.html { redirect_to @event, notice: "Event was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @event }
      else
        format.html { render :edit, status: :unprocessable_entity }
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
