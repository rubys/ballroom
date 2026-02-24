require "test_helper"

class SolosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @solo = solos(:one)
  end

  test "should get index" do
    get solos_url
    assert_response :success
  end

  test "should get new" do
    get new_solo_url
    assert_response :success
  end

  test "should create solo" do
    assert_difference("Solo.count") do
      post solos_url, params: { solo: { artist: @solo.artist, category_override_id: @solo.category_override_id, combo_dance_id: @solo.combo_dance_id, heat_id: @solo.heat_id, order: @solo.order, song: @solo.song } }
    end

    assert_redirected_to solo_url(Solo.last)
  end

  test "should show solo" do
    get solo_url(@solo)
    assert_response :success
  end

  test "should get edit" do
    get edit_solo_url(@solo)
    assert_response :success
  end

  test "should update solo" do
    patch solo_url(@solo), params: { solo: { artist: @solo.artist, category_override_id: @solo.category_override_id, combo_dance_id: @solo.combo_dance_id, heat_id: @solo.heat_id, order: @solo.order, song: @solo.song } }
    assert_redirected_to solo_url(@solo)
  end

  test "should destroy solo" do
    solo = Solo.create!(heat: heats(:one), order: 99)
    assert_difference("Solo.count", -1) do
      delete solo_url(solo)
    end

    assert_redirected_to solos_url
  end
end
