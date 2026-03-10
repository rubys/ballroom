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
      post categories_url, params: { category: { name: "New Category", order: 99 } }
    end

    assert_redirected_to categories_url
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
    patch category_url(@category), params: { category: { name: @category.name, order: @category.order } }
    assert_redirected_to categories_url
  end

  test "should destroy category" do
    category = Category.create!(name: "Deletable", order: 99)
    assert_difference("Category.count", -1) do
      delete category_url(category)
    end

    assert_redirected_to categories_url
  end

  test "should reorder categories via drop" do
    cat1 = categories(:one)
    cat2 = categories(:two)

    post drop_categories_url, params: { source: cat1.id.to_s, target: cat2.id.to_s }, as: :json

    assert_redirected_to categories_url

    cat1.reload
    cat2.reload
    assert cat1.order > cat2.order, "Source should have moved after target"
  end
end
