require "test_helper"

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = categories(:one)
  end

  test "should get index" do
    get categories_url
    assert_response :success
  end

  test "should get new" do
    get new_category_url
    assert_response :success
  end

  test "should create category" do
    assert_difference("Category.count") do
      post categories_url, params: { category: { ballrooms: @category.ballrooms, cost_override: @category.cost_override, day: @category.day, duration: @category.duration, locked: @category.locked, max_heat_size: @category.max_heat_size, name: @category.name, order: @category.order, pro: @category.pro, routines: @category.routines, split: @category.split, studio_cost_override: @category.studio_cost_override, time: @category.time, use_category_scoring: @category.use_category_scoring } }
    end

    assert_redirected_to category_url(Category.last)
  end

  test "should show category" do
    get category_url(@category)
    assert_response :success
  end

  test "should get edit" do
    get edit_category_url(@category)
    assert_response :success
  end

  test "should update category" do
    patch category_url(@category), params: { category: { ballrooms: @category.ballrooms, cost_override: @category.cost_override, day: @category.day, duration: @category.duration, locked: @category.locked, max_heat_size: @category.max_heat_size, name: @category.name, order: @category.order, pro: @category.pro, routines: @category.routines, split: @category.split, studio_cost_override: @category.studio_cost_override, time: @category.time, use_category_scoring: @category.use_category_scoring } }
    assert_redirected_to category_url(@category)
  end

  test "should destroy category" do
    category = Category.create!(name: "Deletable")
    assert_difference("Category.count", -1) do
      delete category_url(category)
    end

    assert_redirected_to categories_url
  end
end
