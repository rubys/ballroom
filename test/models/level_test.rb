require "test_helper"

class LevelTest < ActiveSupport::TestCase
  test "fixtures load" do
    assert_equal "Full Gold", levels(:FG).name
    assert_equal "Newcomer", levels(:N).name
  end

  test "initials extracts uppercase letters and digits" do
    level = levels(:FG)
    assert_equal "FG", level.initials
  end

  test "initials for newcomer" do
    level = levels(:N)
    assert_equal "N", level.initials
  end

  test "initials for associate bronze" do
    level = levels(:AB)
    assert_equal "AB", level.initials
  end
end
