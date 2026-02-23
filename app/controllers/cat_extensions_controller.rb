class CatExtensionsController < ApplicationController
  before_action :set_cat_extension, only: %i[ show edit update destroy ]

  # GET /cat_extensions or /cat_extensions.json
  def index
    @cat_extensions = CatExtension.all
  end

  # GET /cat_extensions/1 or /cat_extensions/1.json
  def show
  end

  # GET /cat_extensions/new
  def new
    @cat_extension = CatExtension.new
  end

  # GET /cat_extensions/1/edit
  def edit
  end

  # POST /cat_extensions or /cat_extensions.json
  def create
    @cat_extension = CatExtension.new(cat_extension_params)

    respond_to do |format|
      if @cat_extension.save
        format.html { redirect_to @cat_extension, notice: "Cat extension was successfully created." }
        format.json { render :show, status: :created, location: @cat_extension }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @cat_extension.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cat_extensions/1 or /cat_extensions/1.json
  def update
    respond_to do |format|
      if @cat_extension.update(cat_extension_params)
        format.html { redirect_to @cat_extension, notice: "Cat extension was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @cat_extension }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @cat_extension.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cat_extensions/1 or /cat_extensions/1.json
  def destroy
    @cat_extension.destroy!

    respond_to do |format|
      format.html { redirect_to cat_extensions_path, notice: "Cat extension was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cat_extension
      @cat_extension = CatExtension.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def cat_extension_params
      params.expect(cat_extension: [ :category_id, :part, :order, :start_heat, :day, :time, :duration ])
    end
end
