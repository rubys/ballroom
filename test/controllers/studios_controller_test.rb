require "test_helper"

class StudiosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @studio = studios(:one)
  end

  test "should get index" do
    get studios_url
    assert_response :success
  end

  test "should get new" do
    get new_studio_url
    assert_response :success
  end

  test "should create studio" do
    assert_difference("Studio.count") do
      post studios_url, params: { studio: { ballroom: @studio.ballroom, email: @studio.email, heat_cost: @studio.heat_cost, multi_cost: @studio.multi_cost, name: @studio.name, solo_cost: @studio.solo_cost, student_heat_cost: @studio.student_heat_cost, student_multi_cost: @studio.student_multi_cost, student_registration_cost: @studio.student_registration_cost, student_solo_cost: @studio.student_solo_cost, tables: @studio.tables } }
    end

    assert_redirected_to studio_url(Studio.last)
  end

  test "should show studio" do
    get studio_url(@studio)
    assert_response :success
  end

  test "should get edit" do
    get edit_studio_url(@studio)
    assert_response :success
  end

  test "should update studio" do
    patch studio_url(@studio), params: { studio: { ballroom: @studio.ballroom, email: @studio.email, heat_cost: @studio.heat_cost, multi_cost: @studio.multi_cost, name: @studio.name, solo_cost: @studio.solo_cost, student_heat_cost: @studio.student_heat_cost, student_multi_cost: @studio.student_multi_cost, student_registration_cost: @studio.student_registration_cost, student_solo_cost: @studio.student_solo_cost, tables: @studio.tables } }
    assert_redirected_to studio_url(@studio)
  end

  test "should destroy studio" do
    assert_difference("Studio.count", -1) do
      delete studio_url(@studio)
    end

    assert_redirected_to studios_url
  end
end
