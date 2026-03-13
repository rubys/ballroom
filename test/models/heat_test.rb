require "test_helper"

class HeatTest < ActiveSupport::TestCase
  test "number strips trailing .0 from whole numbers" do
    heat = Heat.new(number: 3.0)
    assert_equal 3, heat.number
  end

  test "number preserves fractional values" do
    heat = Heat.new(number: 1.5)
    assert_equal 1.5, heat.number
  end

  test "dance_category returns open_category for Open heats" do
    heat = heats(:one)
    heat.category = "Open"
    assert_equal heat.dance.open_category, heat.dance_category
  end

  test "dance_category returns closed_category for Closed heats" do
    heat = heats(:one)
    heat.category = "Closed"
    assert_equal heat.dance.closed_category, heat.dance_category
  end

  test "dance_category returns solo_category for Solo heats" do
    heat = heats(:one)
    heat.category = "Solo"
    assert_equal heat.dance.solo_category, heat.dance_category
  end

  test "dance_category returns multi_category for Multi heats" do
    heat = heats(:one)
    heat.category = "Multi"
    assert_equal heat.dance.multi_category, heat.dance_category
  end

  test "subject delegates to entry" do
    heat = heats(:one)
    assert_equal heat.entry.subject, heat.subject
  end
end
