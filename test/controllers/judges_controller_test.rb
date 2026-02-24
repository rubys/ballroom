require "test_helper"

class JudgesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @judge = judges(:one)
  end

  test "should get index" do
    get judges_url
    assert_response :success
  end

  test "should get new" do
    get new_judge_url
    assert_response :success
  end

  test "should create judge" do
    assert_difference("Judge.count") do
      post judges_url, params: { judge: { ballroom: @judge.ballroom, person_id: @judge.person_id, present: @judge.present, review_solos: @judge.review_solos, show_assignments: @judge.show_assignments, sort_order: @judge.sort_order } }
    end

    assert_redirected_to judge_url(Judge.last)
  end

  test "should show judge" do
    get judge_url(@judge)
    assert_response :success
  end

  test "should get edit" do
    get edit_judge_url(@judge)
    assert_response :success
  end

  test "should update judge" do
    patch judge_url(@judge), params: { judge: { ballroom: @judge.ballroom, person_id: @judge.person_id, present: @judge.present, review_solos: @judge.review_solos, show_assignments: @judge.show_assignments, sort_order: "A1" } }
    assert_redirected_to judge_url(@judge)
    @judge.reload
    assert_equal "A1", @judge.sort_order
  end

  test "should destroy judge" do
    judge = Judge.create!(person: Person.create!(name: "Judge Test"))
    assert_difference("Judge.count", -1) do
      delete judge_url(judge)
    end

    assert_redirected_to judges_url
  end
end
