require "test_helper"

class DancesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @dance = dances(:one)
  end

  test "should get index" do
    get dances_url
    assert_response :success
  end

  test "should get new" do
    get new_dance_url
    assert_response :success
  end

  test "should create dance" do
    assert_difference("Dance.count") do
      post dances_url, params: { dance: { name: "New Dance", closed_category_id: @dance.closed_category_id, open_category_id: @dance.open_category_id, solo_category_id: @dance.solo_category_id } }
    end

    assert_redirected_to dances_url
  end

  test "should show dance" do
    get dance_url(@dance)
    assert_response :success
  end

  test "should get edit" do
    get edit_dance_url(@dance)
    assert_response :success
  end

  test "should update dance" do
    patch dance_url(@dance), params: { dance: { name: @dance.name, closed_category_id: @dance.closed_category_id, open_category_id: @dance.open_category_id, solo_category_id: @dance.solo_category_id } }
    assert_redirected_to dances_url
  end

  test "should destroy dance" do
    dance = Dance.create!(name: "Deletable", order: 999)
    assert_difference("Dance.count", -1) do
      delete dance_url(dance)
    end

    assert_redirected_to dances_url
  end
end
