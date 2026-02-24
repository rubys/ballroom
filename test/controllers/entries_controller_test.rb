require "test_helper"

class EntriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @entry = entries(:one)
  end

  test "should get index" do
    get entries_url
    assert_response :success
  end

  test "should get new" do
    get new_entry_url
    assert_response :success
  end

  test "should create entry" do
    assert_difference("Entry.count") do
      post entries_url, params: { entry: { age_id: @entry.age_id, follow_id: @entry.follow_id, instructor_id: @entry.instructor_id, lead_id: @entry.lead_id, level_id: @entry.level_id, studio_id: @entry.studio_id } }
    end

    assert_redirected_to entry_url(Entry.last)
  end

  test "should show entry" do
    get entry_url(@entry)
    assert_response :success
  end

  test "should get edit" do
    get edit_entry_url(@entry)
    assert_response :success
  end

  test "should update entry" do
    patch entry_url(@entry), params: { entry: { age_id: @entry.age_id, follow_id: @entry.follow_id, instructor_id: @entry.instructor_id, lead_id: @entry.lead_id, level_id: @entry.level_id, studio_id: @entry.studio_id } }
    assert_redirected_to entry_url(@entry)
  end

  test "should destroy entry" do
    entry = Entry.create!(lead: people(:one), follow: people(:two), age: ages(:one), level: levels(:one))
    assert_difference("Entry.count", -1) do
      delete entry_url(entry)
    end

    assert_redirected_to entries_url
  end
end
