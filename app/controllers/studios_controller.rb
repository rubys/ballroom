class StudiosController < ApplicationController
  before_action :set_studio, only: %i[ show edit update destroy unpair ]
  before_action :setup_form, only: %i[ new edit ]

  # GET /studios or /studios.json
  def index
    @studios = Studio.all.by_name
    @total_count = Person.where("studio_id is not null").count
  end

  # GET /studios/1 or /studios/1.json
  def show
  end

  # GET /studios/new
  def new
  end

  # GET /studios/1/edit
  def edit
    @avail.select! {|studio| studio != @studio.name and not @pairs.any? {|pair| pair.name == studio}}
  end

  # POST /studios or /studios.json
  def create
    @studio = Studio.new(studio_params.except(:pair, :cost_override, :student_cost_override))

    cost_override

    respond_to do |format|
      if @studio.save
        add_pair
        format.html { redirect_to @studio, notice: "#{@studio.name} was successfully created." }
        format.json { render :show, status: :created, location: @studio }
      else
        setup_form
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @studio.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /studios/1 or /studios/1.json
  def update
    respond_to do |format|
      add_pair
      cost_override

      if @studio.update(studio_params.except(:pair, :cost_override, :student_cost_override))
        format.html { redirect_to @studio, notice: "#{@studio.name} was successfully updated." }
        format.json { render :show, status: :ok, location: @studio }
      else
        setup_form
        @avail.select! {|studio| studio != @studio.name and not @pairs.any? {|pair| pair.name == studio}}
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @studio.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /studios/1 or /studios/1.json
  def destroy
    @studio.destroy

    respond_to do |format|
      format.html { redirect_to studios_url, status: 303, notice: "#{@studio.name} was successfully removed." }
      format.json { head :no_content }
    end
  end

  # POST /studios/1/unpair
  def unpair
    pair_name = params[:pair]
    pair_studio = Studio.find_by(name: pair_name)

    if pair_studio
      StudioPair.where(studio1: @studio, studio2: pair_studio)
        .or(StudioPair.where(studio1: pair_studio, studio2: @studio))
        .destroy_all
      redirect_to edit_studio_url(@studio), notice: "#{pair_studio.name} was successfully unpaired."
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_studio
      @studio = Studio.find(params.expect(:id))
    end

    def setup_form
      @studio ||= Studio.new
      @pairs = @studio.pairs
      @avail = Studio.where.not(name: "Event Staff").pluck(:name)
      @cost_override = !!(@studio.heat_cost || @studio.solo_cost || @studio.multi_cost)
      @student_cost_override = !!(@studio.student_heat_cost || @studio.student_solo_cost || @studio.student_multi_cost)

      event = Event.current
      @studio.heat_cost ||= event.heat_cost
      @studio.solo_cost ||= event.solo_cost
      @studio.multi_cost ||= event.multi_cost

      @studio.student_heat_cost ||= @studio.heat_cost
      @studio.student_solo_cost ||= @studio.solo_cost
      @studio.student_multi_cost ||= @studio.multi_cost

      @student_packages = Billable.where(type: 'Student').ordered.pluck(:name, :id)
      @professional_packages = Billable.where(type: 'Professional').ordered.pluck(:name, :id)
      @guest_packages = Billable.where(type: 'Guest').ordered.pluck(:name, :id)

      if @studio.default_student_package_id
        @studio.student_registration_cost ||= Billable.find(@studio.default_student_package_id).price
      elsif @student_packages.any?
        @studio.student_registration_cost ||= Billable.find(@student_packages.first[1]).price
      end
    end

    # Only allow a list of trusted parameters through.
    def studio_params
      params.expect(studio: [ :name, :pair, :ballroom, :email,
        :cost_override, :heat_cost, :solo_cost, :multi_cost,
        :student_cost_override, :student_registration_cost,
        :student_heat_cost, :student_solo_cost, :student_multi_cost,
        :default_student_package_id, :default_professional_package_id,
        :default_guest_package_id, :tables ])
    end

    def add_pair
      pair_name = params.dig(:studio, :pair)
      return if pair_name.blank?

      pair_studio = Studio.find_by(name: pair_name)
      return unless pair_studio

      StudioPair.find_or_create_by(studio1: @studio, studio2: pair_studio)
    end

    def cost_override
      if studio_params[:cost_override] == '0'
        params[:studio][:heat_cost] = nil
        params[:studio][:solo_cost] = nil
        params[:studio][:multi_cost] = nil
      end

      if studio_params[:student_cost_override] == '0'
        params[:studio][:student_heat_cost] = nil
        params[:studio][:student_solo_cost] = nil
        params[:studio][:student_multi_cost] = nil
      end
    end
end
