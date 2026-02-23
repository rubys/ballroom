class SolosController < ApplicationController
  before_action :set_solo, only: %i[ show edit update destroy ]

  # GET /solos or /solos.json
  def index
    @solos = Solo.all
  end

  # GET /solos/1 or /solos/1.json
  def show
  end

  # GET /solos/new
  def new
    @solo = Solo.new
  end

  # GET /solos/1/edit
  def edit
  end

  # POST /solos or /solos.json
  def create
    @solo = Solo.new(solo_params)

    respond_to do |format|
      if @solo.save
        format.html { redirect_to @solo, notice: "Solo was successfully created." }
        format.json { render :show, status: :created, location: @solo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @solo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /solos/1 or /solos/1.json
  def update
    respond_to do |format|
      if @solo.update(solo_params)
        format.html { redirect_to @solo, notice: "Solo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @solo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @solo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /solos/1 or /solos/1.json
  def destroy
    @solo.destroy!

    respond_to do |format|
      format.html { redirect_to solos_path, notice: "Solo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_solo
      @solo = Solo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def solo_params
      params.expect(solo: [ :heat_id, :combo_dance_id, :category_override_id, :artist, :song, :order ])
    end
end
