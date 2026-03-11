class CategoriesController < ApplicationController
  before_action :set_category, only: %i[ show edit update destroy ]

  # GET /categories or /categories.json
  def index
    @categories = Category.ordered
    @locked = Event.first&.locked?

    # Build lookup: category_id -> total entries and heats
    # Each dance can belong to a category via 8 different foreign keys
    heat_counts = Heat.group(:dance_id).distinct.count(:number)
    entry_counts = Heat.group(:dance_id).count

    @cat_entries = {}
    @cat_heats = {}

    Dance.all.each do |dance|
      [ dance.open_category_id, dance.closed_category_id, dance.solo_category_id,
       dance.multi_category_id, dance.pro_open_category_id, dance.pro_closed_category_id,
       dance.pro_solo_category_id, dance.pro_multi_category_id ].each do |cat_id|
        next unless cat_id

        @cat_entries[cat_id] = (@cat_entries[cat_id] || 0) + (entry_counts[dance.id] || 0)
        @cat_heats[cat_id] = (@cat_heats[cat_id] || 0) + (heat_counts[dance.id] || 0)
      end
    end
  end

  # GET /categories/1 or /categories/1.json
  def show
  end

  # GET /categories/new
  def new
    @category = Category.new
    @category.order = (Category.maximum(:order) || 0) + 1
  end

  # GET /categories/1/edit
  def edit
  end

  # POST /categories or /categories.json
  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to categories_path, notice: "#{@category.name} was successfully created." }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /categories/1 or /categories/1.json
  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to categories_path, notice: "#{@category.name} was successfully updated." }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /categories/drop
  def drop
    source = Category.find(params[:source].to_i)
    target = Category.find(params[:target].to_i)

    if source.order > target.order
      categories = Category.where(order: target.order..source.order).ordered
      new_order = categories.map(&:order).rotate(1)
    else
      categories = Category.where(order: source.order..target.order).ordered
      new_order = categories.map(&:order).rotate(-1)
    end

    categories.each_with_index do |category, i|
      category.order = new_order[i]
      category.save! validate: false
    end

    redirect_to categories_path, notice: "#{source.name} was successfully moved."
  end

  # DELETE /categories/1 or /categories/1.json
  def destroy
    @category.destroy!

    respond_to do |format|
      format.html { redirect_to categories_path, notice: "#{@category.name} was successfully removed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    def set_category
      @category = Category.find(params.expect(:id))
    end

    def category_params
      params.expect(category: [ :name, :order, :day, :time, :duration, :ballrooms, :split, :cost_override, :studio_cost_override, :max_heat_size, :locked, :pro, :routines, :use_category_scoring ])
    end
end
