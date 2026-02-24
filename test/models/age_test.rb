require "test_helper"

class AgeTest < ActiveSupport::TestCase
  test "fixtures load" do
    assert_equal "Junior", ages(:J).category
    assert_equal "Adult", ages(:A).category
  end

  test "costs association" do
    age = ages(:J)
    assert_equal age_costs(:one), age.costs
  end
end
