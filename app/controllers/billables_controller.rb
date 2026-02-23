class BillablesController < ApplicationController
  before_action :set_billable, only: %i[ show edit update destroy ]

  # GET /billables or /billables.json
  def index
    @billables = Billable.all
  end

  # GET /billables/1 or /billables/1.json
  def show
  end

  # GET /billables/new
  def new
    @billable = Billable.new
  end

  # GET /billables/1/edit
  def edit
  end

  # POST /billables or /billables.json
  def create
    @billable = Billable.new(billable_params)

    respond_to do |format|
      if @billable.save
        format.html { redirect_to @billable, notice: "Billable was successfully created." }
        format.json { render :show, status: :created, location: @billable }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @billable.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /billables/1 or /billables/1.json
  def update
    respond_to do |format|
      if @billable.update(billable_params)
        format.html { redirect_to @billable, notice: "Billable was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @billable }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @billable.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /billables/1 or /billables/1.json
  def destroy
    @billable.destroy!

    respond_to do |format|
      format.html { redirect_to billables_path, notice: "Billable was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_billable
      @billable = Billable.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def billable_params
      params.expect(billable: [ :name, :type, :price, :order, :table_size, :couples ])
    end
end
