require "test_helper"

class AgeCostsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @age_cost = age_costs(:one)
  end

  test "should get index" do
    get age_costs_url
    assert_response :success
  end

  test "should get new" do
    get new_age_cost_url
    assert_response :success
  end

  test "should create age_cost" do
    assert_difference("AgeCost.count") do
      post age_costs_url, params: { age_cost: { age_id: @age_cost.age_id, heat_cost: @age_cost.heat_cost, multi_cost: @age_cost.multi_cost, solo_cost: @age_cost.solo_cost } }
    end

    assert_redirected_to age_cost_url(AgeCost.last)
  end

  test "should show age_cost" do
    get age_cost_url(@age_cost)
    assert_response :success
  end

  test "should get edit" do
    get edit_age_cost_url(@age_cost)
    assert_response :success
  end

  test "should update age_cost" do
    patch age_cost_url(@age_cost), params: { age_cost: { age_id: @age_cost.age_id, heat_cost: @age_cost.heat_cost, multi_cost: @age_cost.multi_cost, solo_cost: @age_cost.solo_cost } }
    assert_redirected_to age_cost_url(@age_cost)
  end

  test "should destroy age_cost" do
    assert_difference("AgeCost.count", -1) do
      delete age_cost_url(@age_cost)
    end

    assert_redirected_to age_costs_url
  end
end
