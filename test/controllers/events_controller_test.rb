require "test_helper"

class EventsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @event = events(:one)
  end

  test "should get index" do
    get events_url
    assert_response :success
  end

  test "should get new" do
    get new_event_url
    assert_response :success
  end

  test "should create event" do
    assert_difference("Event.count") do
      post events_url, params: { event: { agenda_based_entries: @event.agenda_based_entries, assign_judges: @event.assign_judges, backnums: @event.backnums, ballrooms: @event.ballrooms, closed_scoring: @event.closed_scoring, column_order: @event.column_order, counter_color: @event.counter_color, current_heat: @event.current_heat, dance_limit: @event.dance_limit, date: @event.date, email: @event.email, finalist: @event.finalist, font_family: @event.font_family, font_size: @event.font_size, heat_cost: @event.heat_cost, heat_length: @event.heat_length, heat_order: @event.heat_order, heat_range_age: @event.heat_range_age, heat_range_cat: @event.heat_range_cat, heat_range_level: @event.heat_range_level, include_closed: @event.include_closed, include_open: @event.include_open, include_times: @event.include_times, independent_instructors: @event.independent_instructors, intermix: @event.intermix, judge_comments: @event.judge_comments, judge_recordings: @event.judge_recordings, location: @event.location, locked: @event.locked, max_heat_size: @event.max_heat_size, multi_cost: @event.multi_cost, multi_scoring: @event.multi_scoring, name: @event.name, open_scoring: @event.open_scoring, package_required: @event.package_required, partnerless_entries: @event.partnerless_entries, payment_due: @event.payment_due, print_studio_heats: @event.print_studio_heats, pro_am: @event.pro_am, pro_heat_cost: @event.pro_heat_cost, pro_heats: @event.pro_heats, pro_multi_cost: @event.pro_multi_cost, pro_solo_cost: @event.pro_solo_cost, proam_studio_invoice: @event.proam_studio_invoice, solo_cost: @event.solo_cost, solo_length: @event.solo_length, solo_level_id: @event.solo_level_id, solo_scoring: @event.solo_scoring, strict_scoring: @event.strict_scoring, student_judge_assignments: @event.student_judge_assignments, student_package_description: @event.student_package_description, studio_formation_cost: @event.studio_formation_cost, table_size: @event.table_size, theme: @event.theme, track_ages: @event.track_ages } }
    end

    assert_redirected_to event_url(Event.last)
  end

  test "should show event" do
    get event_url(@event)
    assert_response :success
  end

  test "should get edit" do
    get edit_event_url(@event)
    assert_response :success
  end

  test "should update event" do
    patch event_url(@event), params: { event: { agenda_based_entries: @event.agenda_based_entries, assign_judges: @event.assign_judges, backnums: @event.backnums, ballrooms: @event.ballrooms, closed_scoring: @event.closed_scoring, column_order: @event.column_order, counter_color: @event.counter_color, current_heat: @event.current_heat, dance_limit: @event.dance_limit, date: @event.date, email: @event.email, finalist: @event.finalist, font_family: @event.font_family, font_size: @event.font_size, heat_cost: @event.heat_cost, heat_length: @event.heat_length, heat_order: @event.heat_order, heat_range_age: @event.heat_range_age, heat_range_cat: @event.heat_range_cat, heat_range_level: @event.heat_range_level, include_closed: @event.include_closed, include_open: @event.include_open, include_times: @event.include_times, independent_instructors: @event.independent_instructors, intermix: @event.intermix, judge_comments: @event.judge_comments, judge_recordings: @event.judge_recordings, location: @event.location, locked: @event.locked, max_heat_size: @event.max_heat_size, multi_cost: @event.multi_cost, multi_scoring: @event.multi_scoring, name: @event.name, open_scoring: @event.open_scoring, package_required: @event.package_required, partnerless_entries: @event.partnerless_entries, payment_due: @event.payment_due, print_studio_heats: @event.print_studio_heats, pro_am: @event.pro_am, pro_heat_cost: @event.pro_heat_cost, pro_heats: @event.pro_heats, pro_multi_cost: @event.pro_multi_cost, pro_solo_cost: @event.pro_solo_cost, proam_studio_invoice: @event.proam_studio_invoice, solo_cost: @event.solo_cost, solo_length: @event.solo_length, solo_level_id: @event.solo_level_id, solo_scoring: @event.solo_scoring, strict_scoring: @event.strict_scoring, student_judge_assignments: @event.student_judge_assignments, student_package_description: @event.student_package_description, studio_formation_cost: @event.studio_formation_cost, table_size: @event.table_size, theme: @event.theme, track_ages: @event.track_ages } }
    assert_redirected_to event_url(@event)
  end

  test "should destroy event" do
    assert_difference("Event.count", -1) do
      delete event_url(@event)
    end

    assert_redirected_to events_url
  end
end
