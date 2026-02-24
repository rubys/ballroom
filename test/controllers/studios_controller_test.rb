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
      post studios_url, params: { studio: { name: "New Studio" } }
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
    patch studio_url(@studio), params: { studio: { name: "Updated" } }
    assert_redirected_to studio_url(@studio)
  end

  test "should destroy studio" do
    studio = Studio.create!(name: "Deletable")
    assert_difference("Studio.count", -1) do
      delete studio_url(studio)
    end

    assert_redirected_to studios_url
  end

  test "should create studio with pair" do
    assert_difference("StudioPair.count") do
      post studios_url, params: { studio: { name: "Paired Studio", pair: studios(:two).name } }
    end
  end

  test "should update studio with pair" do
    new_studio = Studio.create!(name: "Another Studio")
    assert_difference("StudioPair.count") do
      patch studio_url(new_studio), params: { studio: { name: new_studio.name, pair: studios(:two).name } }
    end
  end

  test "should unpair studios" do
    assert_difference("StudioPair.count", -1) do
      delete unpair_studio_url(@studio), params: { pair: studios(:two).name }
    end

    assert_redirected_to studio_url(@studio)
  end
end
