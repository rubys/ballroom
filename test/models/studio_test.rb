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

  test "studio1s through association" do
    two = studios(:two)
    # studio_pair one: studio1=one, studio2=two
    # two's studio1_pairs = StudioPairs where studio2_id=two.id → pair one
    # studio1s = studio1 from pair → studio one
    assert_includes two.studio1s.pluck(:name), "One"
  end

  test "studio2s through association" do
    one = studios(:one)
    # studio_pair one: studio1=one, studio2=two
    # one's studio2_pairs = StudioPairs where studio1_id=one.id → pair one
    # studio2s = studio2 from pair → studio two
    assert_includes one.studio2s.pluck(:name), "Two"
  end
end
