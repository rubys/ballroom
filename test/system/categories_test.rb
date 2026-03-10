require "application_system_test_case"

class CategoriesSystemTest < ApplicationSystemTestCase
  test "drag and drop reorders categories" do
    visit categories_url

    # Get initial order of first two categories
    rows = all("tbody tr[data-drag-id]")
    first_cat = rows[0].find("td:first-child a").text
    second_cat = rows[1].find("td:first-child a").text

    # Drag first category to second position
    source = rows[0]
    target = rows[1]
    source.drag_to(target)

    # Wait for page to reload by checking the first category changed
    assert_selector "tbody tr[data-drag-id]:first-child td:first-child a", text: second_cat
    rows = all("tbody tr[data-drag-id]")
    assert_equal first_cat, rows[1].find("td:first-child a").text
  end

  test "create, edit, and delete a category" do
    visit categories_url
    assert_text "Agenda"

    click_on "New category"
    fill_in "Name", with: "Latin Solos"
    click_on "Create Category"
    assert_text "Latin Solos was successfully created."

    click_on "Latin Solos"
    fill_in "Name", with: "Latin Solo Showcase"
    click_on "Update Category"
    assert_text "Latin Solo Showcase was successfully updated."

    click_on "Latin Solo Showcase"
    accept_confirm do
      click_on "Remove this category"
    end
    assert_text "Latin Solo Showcase was successfully removed."
  end
end
