require "test_helper"

class PeopleControllerTest < ActionDispatch::IntegrationTest
  setup do
    @person = people(:one)
  end

  test "should get index" do
    get people_url
    assert_response :success
  end

  test "should get new" do
    get new_person_url
    assert_response :success
  end

  test "should create person" do
    assert_difference("Person.count") do
      post people_url, params: { person: { age_id: @person.age_id, available: @person.available, back: @person.back, exclude_id: @person.exclude_id, independent: @person.independent, invoice_to_id: @person.invoice_to_id, level_id: @person.level_id, name: @person.name, package_id: @person.package_id, role: @person.role, studio_id: @person.studio_id, table_id: @person.table_id, type: @person.type } }
    end

    assert_redirected_to person_url(Person.last)
  end

  test "should show person" do
    get person_url(@person)
    assert_response :success
  end

  test "should get edit" do
    get edit_person_url(@person)
    assert_response :success
  end

  test "should update person" do
    patch person_url(@person), params: { person: { age_id: @person.age_id, available: @person.available, back: @person.back, exclude_id: @person.exclude_id, independent: @person.independent, invoice_to_id: @person.invoice_to_id, level_id: @person.level_id, name: @person.name, package_id: @person.package_id, role: @person.role, studio_id: @person.studio_id, table_id: @person.table_id, type: @person.type } }
    assert_redirected_to person_url(@person)
  end

  test "should destroy person" do
    person = Person.create!(name: "Deletable")
    assert_difference("Person.count", -1) do
      delete person_url(person)
    end

    assert_redirected_to people_url
  end
end
