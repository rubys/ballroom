class DancesController < ApplicationController
  before_action :set_dance, only: %i[ show edit update destroy ]

  # GET /dances or /dances.json
  def index
    @dances = Dance.all
  end

  # GET /dances/1 or /dances/1.json
  def show
  end

  # GET /dances/new
  def new
    @dance = Dance.new
  end

  # GET /dances/1/edit
  def edit
  end

  # POST /dances or /dances.json
  def create
    @dance = Dance.new(dance_params)

    respond_to do |format|
      if @dance.save
        format.html { redirect_to @dance, notice: "Dance was successfully created." }
        format.json { render :show, status: :created, location: @dance }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @dance.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dances/1 or /dances/1.json
  def update
    respond_to do |format|
      if @dance.update(dance_params)
        format.html { redirect_to @dance, notice: "Dance was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @dance }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @dance.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dances/1 or /dances/1.json
  def destroy
    @dance.destroy!

    respond_to do |format|
      format.html { redirect_to dances_path, notice: "Dance was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dance
      @dance = Dance.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def dance_params
      params.expect(dance: [ :name, :order, :heat_length, :limit, :col, :row, :cost_override, :semi_finals, :open_category_id, :closed_category_id, :solo_category_id, :multi_category_id, :pro_open_category_id, :pro_closed_category_id, :pro_solo_category_id, :pro_multi_category_id ])
    end
end
