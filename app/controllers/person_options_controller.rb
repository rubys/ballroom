class PersonOptionsController < ApplicationController
  before_action :set_person_option, only: %i[ show edit update destroy ]

  # GET /person_options or /person_options.json
  def index
    @person_options = PersonOption.all
  end

  # GET /person_options/1 or /person_options/1.json
  def show
  end

  # GET /person_options/new
  def new
    @person_option = PersonOption.new
  end

  # GET /person_options/1/edit
  def edit
  end

  # POST /person_options or /person_options.json
  def create
    @person_option = PersonOption.new(person_option_params)

    respond_to do |format|
      if @person_option.save
        format.html { redirect_to @person_option, notice: "Person option was successfully created." }
        format.json { render :show, status: :created, location: @person_option }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @person_option.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /person_options/1 or /person_options/1.json
  def update
    respond_to do |format|
      if @person_option.update(person_option_params)
        format.html { redirect_to @person_option, notice: "Person option was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @person_option }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @person_option.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /person_options/1 or /person_options/1.json
  def destroy
    @person_option.destroy!

    respond_to do |format|
      format.html { redirect_to person_options_path, notice: "Person option was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person_option
      @person_option = PersonOption.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def person_option_params
      params.expect(person_option: [ :person_id, :option_id, :table_id ])
    end
end
