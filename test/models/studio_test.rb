require "test_helper"

class StudioTest < ActiveSupport::TestCase
  test "fixtures load" do
    assert_equal "One", studios(:one).name
    assert_equal "Event Staff", studios(:zero).name
  end

  test "name is required" do
    studio = Studio.new(name: "")
    assert_not studio.valid?
    assert_includes studio.errors[:name], "can't be blank"
  end

  test "name must be unique" do
    Studio.create!(name: "Unique Studio")
    duplicate = Studio.new(name: "Unique Studio")
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:name], "has already been taken"
  end

  test "normalizes strips whitespace from name" do
    studio = Studio.new(name: "  Trimmed  ")
    assert_equal "Trimmed", studio.name
  end

  test "by_name scope orders by name" do
    names = Studio.by_name.pluck(:name)
    assert_equal names.sort, names
  end

  test "pairs returns paired studios" do
    studio = studios(:one)
    pair_names = studio.pairs.pluck(:name)
    assert_includes pair_names, "Two"
  end
end
