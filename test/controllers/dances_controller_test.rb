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
      post dances_url, params: { dance: { closed_category_id: @dance.closed_category_id, col: @dance.col, cost_override: @dance.cost_override, heat_length: @dance.heat_length, limit: @dance.limit, multi_category_id: @dance.multi_category_id, name: @dance.name, open_category_id: @dance.open_category_id, order: @dance.order, pro_closed_category_id: @dance.pro_closed_category_id, pro_multi_category_id: @dance.pro_multi_category_id, pro_open_category_id: @dance.pro_open_category_id, pro_solo_category_id: @dance.pro_solo_category_id, row: @dance.row, semi_finals: @dance.semi_finals, solo_category_id: @dance.solo_category_id } }
    end

    assert_redirected_to dance_url(Dance.last)
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
    patch dance_url(@dance), params: { dance: { closed_category_id: @dance.closed_category_id, col: @dance.col, cost_override: @dance.cost_override, heat_length: @dance.heat_length, limit: @dance.limit, multi_category_id: @dance.multi_category_id, name: @dance.name, open_category_id: @dance.open_category_id, order: @dance.order, pro_closed_category_id: @dance.pro_closed_category_id, pro_multi_category_id: @dance.pro_multi_category_id, pro_open_category_id: @dance.pro_open_category_id, pro_solo_category_id: @dance.pro_solo_category_id, row: @dance.row, semi_finals: @dance.semi_finals, solo_category_id: @dance.solo_category_id } }
    assert_redirected_to dance_url(@dance)
  end

  test "should destroy dance" do
    dance = Dance.create!(name: "Deletable")
    assert_difference("Dance.count", -1) do
      delete dance_url(dance)
    end

    assert_redirected_to dances_url
  end
end
