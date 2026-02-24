class StudiosController < ApplicationController
  before_action :set_studio, only: %i[ show edit update destroy unpair ]

  # GET /studios or /studios.json
  def index
    @studios = Studio.all
  end

  # GET /studios/1 or /studios/1.json
  def show
  end

  # GET /studios/new
  def new
    @studio = Studio.new
  end

  # GET /studios/1/edit
  def edit
  end

  # POST /studios or /studios.json
  def create
    @studio = Studio.new(studio_params.except(:pair))

    respond_to do |format|
      if @studio.save
        add_pair
        format.html { redirect_to @studio, notice: "#{@studio.name} was successfully created." }
        format.json { render :show, status: :created, location: @studio }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @studio.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /studios/1 or /studios/1.json
  def update
    respond_to do |format|
      if @studio.update(studio_params.except(:pair))
        add_pair
        format.html { redirect_to @studio, notice: "#{@studio.name} was successfully updated." }
        format.json { render :show, status: :ok, location: @studio }
      else
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

    # Only allow a list of trusted parameters through.
    def studio_params
      params.expect(studio: [ :name, :pair, :ballroom, :email, :heat_cost, :multi_cost, :solo_cost, :student_heat_cost, :student_multi_cost, :student_registration_cost, :student_solo_cost, :tables ])
    end

    def add_pair
      pair_name = params.dig(:studio, :pair)
      return if pair_name.blank?

      pair_studio = Studio.find_by(name: pair_name)
      return unless pair_studio

      StudioPair.find_or_create_by(studio1: @studio, studio2: pair_studio)
    end
end
