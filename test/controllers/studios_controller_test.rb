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
      post studios_url, params: { studio: { name: "Mars" } }
    end

    assert_redirected_to studio_url(Studio.last)
    assert_equal "Mars was successfully created.", flash[:notice]
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
    patch studio_url(@studio), params: { studio: { name: @studio.name } }
    assert_redirected_to studio_url(@studio)
    assert_equal "One was successfully updated.", flash[:notice]
  end

  test "should pair studio" do
    three = studios(:three)

    patch studio_url(@studio), params: { studio: { pair: three.name } }
    assert_redirected_to studio_url(@studio)

    assert_equal [ @studio.name ], three.pairs.pluck(:name)
    pair_names = @studio.pairs.pluck(:name)
    assert_equal 2, pair_names.length
    assert_includes pair_names, three.name
  end

  test "should unpair studio - left" do
    two = studios(:two)

    post unpair_studio_url(@studio), params: { pair: two.name }
    assert_redirected_to edit_studio_url(@studio)

    assert_empty two.pairs
    assert_empty @studio.pairs
  end

  test "should unpair studio - right" do
    two = studios(:two)

    post unpair_studio_url(two), params: { pair: @studio.name }
    assert_redirected_to edit_studio_url(two)

    assert_empty two.pairs
    assert_empty @studio.pairs
  end

  test "should destroy studio" do
    studio = Studio.create!(name: "Deletable")
    assert_difference("Studio.count", -1) do
      delete studio_url(studio)
    end

    assert_response 303
    assert_redirected_to studios_url
    assert_equal "Deletable was successfully removed.", flash[:notice]
  end

  test "should create studio with cost override" do
    assert_difference("Studio.count") do
      post studios_url, params: { studio: {
        name: "CostStudio",
        cost_override: "1",
        heat_cost: "15.00",
        solo_cost: "25.00",
        multi_cost: "35.00"
      } }
    end

    studio = Studio.find_by(name: "CostStudio")
    assert_equal 15.00, studio.heat_cost.to_f
    assert_equal 25.00, studio.solo_cost.to_f
    assert_equal 35.00, studio.multi_cost.to_f
  end

  test "should clear costs when cost override unchecked" do
    @studio.update!(heat_cost: 10.00, solo_cost: 20.00, multi_cost: 30.00)

    patch studio_url(@studio), params: { studio: {
      name: @studio.name,
      cost_override: "0",
      heat_cost: "10.00",
      solo_cost: "20.00",
      multi_cost: "30.00"
    } }

    assert_redirected_to studio_url(@studio)
    @studio.reload
    assert_nil @studio.heat_cost
    assert_nil @studio.solo_cost
    assert_nil @studio.multi_cost
  end

  test "should clear student costs when student cost override unchecked" do
    @studio.update!(student_heat_cost: 5.00, student_solo_cost: 10.00, student_multi_cost: 15.00)

    patch studio_url(@studio), params: { studio: {
      name: @studio.name,
      student_cost_override: "0",
      student_heat_cost: "5.00",
      student_solo_cost: "10.00",
      student_multi_cost: "15.00"
    } }

    assert_redirected_to studio_url(@studio)
    @studio.reload
    assert_nil @studio.student_heat_cost
    assert_nil @studio.student_solo_cost
    assert_nil @studio.student_multi_cost
  end

  test "should update studio with student cost override" do
    patch studio_url(@studio), params: { studio: {
      name: @studio.name,
      student_cost_override: "1",
      student_registration_cost: "50.00",
      student_heat_cost: "12.00",
      student_solo_cost: "22.00",
      student_multi_cost: "32.00"
    } }

    assert_redirected_to studio_url(@studio)
    @studio.reload
    assert_equal 50.00, @studio.student_registration_cost.to_f
    assert_equal 12.00, @studio.student_heat_cost.to_f
    assert_equal 22.00, @studio.student_solo_cost.to_f
    assert_equal 32.00, @studio.student_multi_cost.to_f
  end

  test "should set default package" do
    package = billables(:student_premium)  # Student Premium, $100

    patch studio_url(@studio), params: { studio: {
      name: @studio.name,
      default_student_package_id: package.id
    } }

    assert_redirected_to studio_url(@studio)
    @studio.reload
    assert_equal package.id, @studio.default_student_package_id
  end

  test "edit form shows cost override fields" do
    get edit_studio_url(@studio)
    assert_response :success
    assert_select "input[name='studio[cost_override]']"
    assert_select "input[name='studio[student_cost_override]']"
  end

  test "edit form shows package selects when multiple packages exist" do
    get edit_studio_url(@studio)
    assert_response :success
    assert_select "select[name='studio[default_student_package_id]']"
    assert_select "select[name='studio[default_professional_package_id]']"
    assert_select "select[name='studio[default_guest_package_id]']"
  end
end
