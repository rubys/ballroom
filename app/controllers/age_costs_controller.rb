class AgeCostsController < ApplicationController
  before_action :set_age_cost, only: %i[ show edit update destroy ]

  # GET /age_costs or /age_costs.json
  def index
    @age_costs = AgeCost.all
  end

  # GET /age_costs/1 or /age_costs/1.json
  def show
  end

  # GET /age_costs/new
  def new
    @age_cost = AgeCost.new
  end

  # GET /age_costs/1/edit
  def edit
  end

  # POST /age_costs or /age_costs.json
  def create
    @age_cost = AgeCost.new(age_cost_params)

    respond_to do |format|
      if @age_cost.save
        format.html { redirect_to @age_cost, notice: "Age cost was successfully created." }
        format.json { render :show, status: :created, location: @age_cost }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @age_cost.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /age_costs/1 or /age_costs/1.json
  def update
    respond_to do |format|
      if @age_cost.update(age_cost_params)
        format.html { redirect_to @age_cost, notice: "Age cost was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @age_cost }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @age_cost.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /age_costs/1 or /age_costs/1.json
  def destroy
    @age_cost.destroy!

    respond_to do |format|
      format.html { redirect_to age_costs_path, notice: "Age cost was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_age_cost
      @age_cost = AgeCost.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def age_cost_params
      params.expect(age_cost: [ :age_id, :heat_cost, :solo_cost, :multi_cost ])
    end
end
