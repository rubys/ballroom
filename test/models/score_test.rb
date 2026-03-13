require "test_helper"

class ScoreTest < ActiveSupport::TestCase
  test "display_value returns plain value for simple scores" do
    score = scores(:one)
    assert_equal "MyString", score.display_value
  end

  test "display_value parses JSON value" do
    score = scores(:json_score)
    assert_equal "Part1: 5, Part2: 4", score.display_value
  end

  test "display_value returns nil when value is nil" do
    score = Score.new
    assert_equal false, score.display_value.present?
  end

  test "category_score? returns true for negative heat_id" do
    score = scores(:category_score)
    assert score.category_score?
  end

  test "category_score? returns false for positive heat_id" do
    score = scores(:one)
    assert_not score.category_score?
  end

  test "per_heat_score? returns true for positive heat_id" do
    score = scores(:one)
    assert score.per_heat_score?
  end

  test "per_heat_score? returns false for negative heat_id" do
    score = scores(:category_score)
    assert_not score.per_heat_score?
  end

  test "actual_category_id returns negated heat_id for category scores" do
    score = scores(:category_score)
    assert_equal 1, score.actual_category_id
  end

  test "actual_category_id returns falsy for heat scores" do
    score = scores(:one)
    assert_not score.actual_category_id
  end
end
