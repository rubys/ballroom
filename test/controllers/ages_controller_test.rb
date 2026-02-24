require "test_helper"

class AgesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @age = ages(:one)
  end

  test "should get index" do
    get ages_url
    assert_response :success
  end

  test "should get new" do
    get new_age_url
    assert_response :success
  end

  test "should create age" do
    assert_difference("Age.count") do
      post ages_url, params: { age: { category: @age.category, description: @age.description } }
    end

    assert_redirected_to age_url(Age.last)
  end

  test "should show age" do
    get age_url(@age)
    assert_response :success
  end

  test "should get edit" do
    get edit_age_url(@age)
    assert_response :success
  end

  test "should update age" do
    patch age_url(@age), params: { age: { category: @age.category, description: @age.description } }
    assert_redirected_to age_url(@age)
  end

  test "should destroy age" do
    age = Age.create!(category: "Deletable")
    assert_difference("Age.count", -1) do
      delete age_url(age)
    end

    assert_redirected_to ages_url
  end
end
