require "test_helper"

class PersonOptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @person_option = person_options(:one)
  end

  test "should get index" do
    get person_options_url
    assert_response :success
  end

  test "should get new" do
    get new_person_option_url
    assert_response :success
  end

  test "should create person_option" do
    assert_difference("PersonOption.count") do
      post person_options_url, params: { person_option: { option_id: @person_option.option_id, person_id: @person_option.person_id, table_id: @person_option.table_id } }
    end

    assert_redirected_to person_option_url(PersonOption.last)
  end

  test "should show person_option" do
    get person_option_url(@person_option)
    assert_response :success
  end

  test "should get edit" do
    get edit_person_option_url(@person_option)
    assert_response :success
  end

  test "should update person_option" do
    patch person_option_url(@person_option), params: { person_option: { option_id: @person_option.option_id, person_id: @person_option.person_id, table_id: @person_option.table_id } }
    assert_redirected_to person_option_url(@person_option)
  end

  test "should destroy person_option" do
    assert_difference("PersonOption.count", -1) do
      delete person_option_url(@person_option)
    end

    assert_redirected_to person_options_url
  end
end
