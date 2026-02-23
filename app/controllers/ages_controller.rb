class AgesController < ApplicationController
  before_action :set_age, only: %i[ show edit update destroy ]

  # GET /ages or /ages.json
  def index
    @ages = Age.all
  end

  # GET /ages/1 or /ages/1.json
  def show
  end

  # GET /ages/new
  def new
    @age = Age.new
  end

  # GET /ages/1/edit
  def edit
  end

  # POST /ages or /ages.json
  def create
    @age = Age.new(age_params)

    respond_to do |format|
      if @age.save
        format.html { redirect_to @age, notice: "Age was successfully created." }
        format.json { render :show, status: :created, location: @age }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @age.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ages/1 or /ages/1.json
  def update
    respond_to do |format|
      if @age.update(age_params)
        format.html { redirect_to @age, notice: "Age was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @age }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @age.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ages/1 or /ages/1.json
  def destroy
    @age.destroy!

    respond_to do |format|
      format.html { redirect_to ages_path, notice: "Age was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_age
      @age = Age.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def age_params
      params.expect(age: [ :category, :description ])
    end
end
