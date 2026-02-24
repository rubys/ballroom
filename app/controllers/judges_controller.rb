class JudgesController < ApplicationController
  before_action :set_judge, only: %i[ show edit update destroy ]

  # GET /judges or /judges.json
  def index
    @judges = Judge.all
  end

  # GET /judges/1 or /judges/1.json
  def show
  end

  # GET /judges/new
  def new
    @judge = Judge.new
  end

  # GET /judges/1/edit
  def edit
  end

  # POST /judges or /judges.json
  def create
    @judge = Judge.new(judge_params)

    respond_to do |format|
      if @judge.save
        format.html { redirect_to @judge, notice: "Judge was successfully created." }
        format.json { render :show, status: :created, location: @judge }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @judge.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /judges/1 or /judges/1.json
  def update
    respond_to do |format|
      if @judge.update(judge_params)
        format.html { redirect_to @judge, notice: "Judge was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @judge }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @judge.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /judges/1 or /judges/1.json
  def destroy
    @judge.destroy!

    respond_to do |format|
      format.html { redirect_to judges_path, notice: "Judge was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_judge
      @judge = Judge.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def judge_params
      params.expect(judge: [ :person_id, :ballroom, :present, :sort_order, :review_solos, :show_assignments ])
    end
end
