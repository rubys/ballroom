module ApplicationHelper
  def as_pdf(options = {})
    options.merge(format: :pdf)
  end

  def localized_date(date_string, locale = nil)
    return date_string unless date_string.present?

    locale ||= @locale || ENV.fetch("RAILS_LOCALE", "en_US")
    locale = Locale.to_browser_format(locale)

    if date_string =~ /^(\d{4}-\d{2}-\d{2})( - (\d{4}-\d{2}-\d{2}))?$/
      start_date_str = $1
      end_date_str = $3

      begin
        start_date = Date.parse(start_date_str)

        if end_date_str
          end_date = Date.parse(end_date_str)
          Locale.format_date_range(start_date, end_date, locale)
        else
          Locale.format_single_date(start_date, locale)
        end
      rescue ArgumentError
        date_string
      end
    else
      date_string
    end
  end
end
