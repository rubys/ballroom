require "test_helper"

class CatExtensionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cat_extension = cat_extensions(:one)
  end

  test "should get index" do
    get cat_extensions_url
    assert_response :success
  end

  test "should get new" do
    get new_cat_extension_url
    assert_response :success
  end

  test "should create cat_extension" do
    assert_difference("CatExtension.count") do
      post cat_extensions_url, params: { cat_extension: { category_id: @cat_extension.category_id, day: @cat_extension.day, duration: @cat_extension.duration, order: @cat_extension.order, part: @cat_extension.part, start_heat: @cat_extension.start_heat, time: @cat_extension.time } }
    end

    assert_redirected_to cat_extension_url(CatExtension.last)
  end

  test "should show cat_extension" do
    get cat_extension_url(@cat_extension)
    assert_response :success
  end

  test "should get edit" do
    get edit_cat_extension_url(@cat_extension)
    assert_response :success
  end

  test "should update cat_extension" do
    patch cat_extension_url(@cat_extension), params: { cat_extension: { category_id: @cat_extension.category_id, day: @cat_extension.day, duration: @cat_extension.duration, order: @cat_extension.order, part: @cat_extension.part, start_heat: @cat_extension.start_heat, time: @cat_extension.time } }
    assert_redirected_to cat_extension_url(@cat_extension)
  end

  test "should destroy cat_extension" do
    assert_difference("CatExtension.count", -1) do
      delete cat_extension_url(@cat_extension)
    end

    assert_redirected_to cat_extensions_url
  end
end
