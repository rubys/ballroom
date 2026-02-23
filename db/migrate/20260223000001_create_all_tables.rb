class CreateAllTables < ActiveRecord::Migration[8.1]
  def change
    create_table :levels do |t|
      t.string :name
      t.timestamps
    end

    create_table :ages do |t|
      t.string :category
      t.string :description
      t.timestamps
    end

    create_table :billables do |t|
      t.string :name
      t.string :type
      t.decimal :price, precision: 7, scale: 2
      t.integer :order
      t.integer :table_size
      t.boolean :couples, default: false
      t.timestamps
    end

    create_table :studios do |t|
      t.string :name
      t.string :ballroom
      t.string :email
      t.decimal :heat_cost, precision: 7, scale: 2
      t.decimal :multi_cost, precision: 7, scale: 2
      t.decimal :solo_cost, precision: 7, scale: 2
      t.decimal :student_heat_cost, precision: 7, scale: 2
      t.decimal :student_multi_cost, precision: 7, scale: 2
      t.decimal :student_registration_cost, precision: 7, scale: 2
      t.decimal :student_solo_cost, precision: 7, scale: 2
      t.integer :tables
      t.references :default_student_package, foreign_key: { to_table: :billables }
      t.references :default_professional_package, foreign_key: { to_table: :billables }
      t.references :default_guest_package, foreign_key: { to_table: :billables }
      t.timestamps
    end

    create_table :studio_pairs do |t|
      t.references :studio1, null: false, foreign_key: { to_table: :studios }
      t.references :studio2, null: false, foreign_key: { to_table: :studios }
      t.timestamps
    end

    create_table :age_costs do |t|
      t.references :age, null: false, foreign_key: true
      t.decimal :heat_cost, precision: 7, scale: 2
      t.decimal :solo_cost, precision: 7, scale: 2
      t.decimal :multi_cost, precision: 7, scale: 2
      t.timestamps
    end

    create_table :categories do |t|
      t.string :name
      t.integer :order
      t.string :day
      t.string :time
      t.integer :duration
      t.integer :ballrooms
      t.string :split
      t.decimal :cost_override, precision: 7, scale: 2
      t.decimal :studio_cost_override, precision: 7, scale: 2
      t.integer :max_heat_size
      t.boolean :locked
      t.boolean :pro, default: false
      t.boolean :routines
      t.boolean :use_category_scoring, default: true
      t.timestamps
    end

    create_table :cat_extensions do |t|
      t.references :category, null: false, foreign_key: true
      t.integer :part
      t.integer :order
      t.integer :start_heat
      t.string :day
      t.string :time
      t.integer :duration
      t.timestamps
    end

    create_table :dances do |t|
      t.string :name
      t.integer :order
      t.integer :heat_length
      t.integer :limit
      t.integer :col
      t.integer :row
      t.decimal :cost_override, precision: 7, scale: 2
      t.boolean :semi_finals, default: false
      t.references :open_category, foreign_key: { to_table: :categories }
      t.references :closed_category, foreign_key: { to_table: :categories }
      t.references :solo_category, foreign_key: { to_table: :categories }
      t.references :multi_category, foreign_key: { to_table: :categories }
      t.references :pro_open_category, foreign_key: { to_table: :categories }
      t.references :pro_closed_category, foreign_key: { to_table: :categories }
      t.references :pro_solo_category, foreign_key: { to_table: :categories }
      t.references :pro_multi_category, foreign_key: { to_table: :categories }
      t.timestamps
    end

    create_table :multis do |t|
      t.references :parent, null: false, foreign_key: { to_table: :dances }
      t.references :dance, null: false, foreign_key: true
      t.integer :slot
      t.timestamps
    end

    create_table :multi_levels do |t|
      t.references :dance, null: false, foreign_key: true
      t.string :name
      t.string :couple_type
      t.integer :start_level
      t.integer :stop_level
      t.integer :start_age
      t.integer :stop_age
      t.timestamps
    end

    create_table :songs do |t|
      t.references :dance, null: false, foreign_key: true
      t.string :title
      t.string :artist
      t.integer :order
      t.timestamps
    end

    create_table :tables do |t|
      t.references :option, foreign_key: { to_table: :billables }
      t.integer :row
      t.integer :col
      t.integer :number
      t.integer :size
      t.boolean :locked, default: false
      t.timestamps
    end
    add_index :tables, [:row, :col, :option_id], unique: true

    create_table :people do |t|
      t.string :name
      t.string :type
      t.string :role
      t.integer :back
      t.string :available
      t.boolean :independent, default: false
      t.references :studio, foreign_key: true
      t.references :level, foreign_key: true
      t.references :age, foreign_key: true
      t.references :exclude, foreign_key: { to_table: :people }
      t.references :invoice_to, foreign_key: { to_table: :people }
      t.references :package, foreign_key: { to_table: :billables }
      t.references :table, foreign_key: true
      t.timestamps
    end

    create_table :judges do |t|
      t.references :person, null: false, foreign_key: true
      t.string :ballroom, null: false, default: "Both"
      t.boolean :present, null: false, default: true
      t.string :sort
      t.string :review_solos, default: "All"
      t.string :show_assignments, null: false, default: "first"
      t.timestamps
    end

    create_table :entries do |t|
      t.references :lead, null: false, foreign_key: { to_table: :people }
      t.references :follow, null: false, foreign_key: { to_table: :people }
      t.references :instructor, foreign_key: { to_table: :people }
      t.references :age, null: false, foreign_key: true
      t.references :level, null: false, foreign_key: true
      t.references :studio, foreign_key: true
      t.timestamps
    end

    create_table :heats do |t|
      t.references :dance, null: false, foreign_key: true
      t.references :entry, null: false, foreign_key: true
      t.float :number
      t.string :ballroom
      t.string :category
      t.float :prev_number
      t.timestamps
    end

    create_table :scores do |t|
      t.references :judge, null: false, foreign_key: { to_table: :people }
      t.references :heat
      t.references :person, index: false
      t.string :value
      t.string :good
      t.string :bad
      t.string :comments
      t.integer :slot
      t.timestamps
    end
    add_index :scores, [:heat_id, :judge_id, :person_id], name: "index_scores_on_heat_judge_person", where: "heat_id < 0"
    add_index :scores, :person_id, name: "index_scores_on_person_id", where: "person_id IS NOT NULL"

    create_table :solos do |t|
      t.references :heat, null: false, foreign_key: true
      t.references :combo_dance, foreign_key: { to_table: :dances }
      t.references :category_override, foreign_key: { to_table: :categories }
      t.string :artist
      t.string :song
      t.integer :order
      t.timestamps
    end

    create_table :formations do |t|
      t.references :person, null: false, foreign_key: true
      t.references :solo, null: false, foreign_key: true
      t.boolean :on_floor, default: true
      t.timestamps
    end

    create_table :recordings do |t|
      t.references :heat, null: false, foreign_key: true
      t.references :judge, null: false, foreign_key: true
      t.timestamps
    end

    create_table :package_includes do |t|
      t.references :package, null: false, foreign_key: { to_table: :billables }
      t.references :option, null: false, foreign_key: { to_table: :billables }
      t.timestamps
    end

    create_table :person_options do |t|
      t.references :person, null: false, foreign_key: true
      t.references :option, null: false, foreign_key: { to_table: :billables }
      t.references :table, foreign_key: true
      t.timestamps
    end

    create_table :questions do |t|
      t.references :billable, null: false, foreign_key: true
      t.text :question_text, null: false
      t.string :question_type, null: false
      t.text :choices
      t.integer :order
      t.timestamps
    end
    add_index :questions, [:billable_id, :order]

    create_table :answers do |t|
      t.references :person, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.text :answer_value
      t.timestamps
    end
    add_index :answers, [:person_id, :question_id], unique: true

    create_table :payments do |t|
      t.references :person, null: false, foreign_key: true
      t.decimal :amount
      t.date :date
      t.text :comment
      t.timestamps
    end

    create_table :feedbacks do |t|
      t.string :abbr
      t.string :value
      t.integer :order
      t.timestamps
    end

    create_table :users do |t|
      t.string :userid
      t.string :email
      t.string :name1
      t.string :name2
      t.string :password
      t.string :token
      t.string :link
      t.string :sites
      t.timestamps
    end

    create_table :locations do |t|
      t.string :name
      t.string :key
      t.string :region
      t.float :latitude
      t.float :longitude
      t.string :locale, default: "en_US"
      t.string :logo
      t.string :sisters
      t.integer :trust_level, default: 0
      t.references :user, foreign_key: true
      t.timestamps
    end

    create_table :showcases do |t|
      t.string :name
      t.string :key
      t.integer :year
      t.string :date
      t.integer :order
      t.references :location, null: false, foreign_key: true
      t.timestamps
    end

    create_table :regions do |t|
      t.string :code
      t.string :type
      t.string :location
      t.float :latitude
      t.float :longitude
      t.timestamps
    end

    create_table :events do |t|
      t.string :name
      t.string :date
      t.string :location
      t.string :email
      t.decimal :heat_cost, precision: 7, scale: 2
      t.decimal :solo_cost, precision: 7, scale: 2
      t.decimal :multi_cost, precision: 7, scale: 2
      t.decimal :pro_heat_cost, precision: 7, scale: 2
      t.decimal :pro_solo_cost, precision: 7, scale: 2
      t.decimal :pro_multi_cost, precision: 7, scale: 2
      t.integer :heat_length
      t.integer :solo_length
      t.integer :dance_limit
      t.integer :ballrooms, default: 1
      t.integer :max_heat_size
      t.integer :current_heat
      t.integer :table_size
      t.integer :heat_range_cat
      t.integer :heat_range_level
      t.integer :heat_range_age
      t.integer :column_order, default: 1
      t.integer :assign_judges, default: 0
      t.references :solo_level, foreign_key: { to_table: :levels }
      t.boolean :backnums, default: true
      t.boolean :locked, default: false
      t.boolean :include_open, default: true
      t.boolean :include_closed, default: true
      t.boolean :include_times, default: true
      t.boolean :intermix, default: true
      t.boolean :package_required, default: true
      t.boolean :partnerless_entries, default: false
      t.boolean :independent_instructors, default: false
      t.boolean :pro_heats, default: false
      t.boolean :print_studio_heats, default: false
      t.boolean :judge_comments, default: false
      t.boolean :judge_recordings, default: false
      t.boolean :track_ages, default: true
      t.boolean :agenda_based_entries, default: false
      t.boolean :strict_scoring, default: false
      t.boolean :student_judge_assignments, default: false
      t.string :open_scoring, default: "1"
      t.string :closed_scoring, default: "G"
      t.string :solo_scoring, default: "1"
      t.string :multi_scoring, default: "1"
      t.string :heat_order, default: "L"
      t.string :pro_am, default: "G"
      t.string :proam_studio_invoice, default: "A"
      t.string :finalist, default: "F"
      t.string :payment_due
      t.string :theme
      t.string :font_family, default: "Helvetica, Arial"
      t.string :font_size, default: "100%"
      t.string :counter_color, default: "#FFFFFF"
      t.string :student_package_description
      t.decimal :studio_formation_cost, precision: 7, scale: 2
      t.timestamps
    end
  end
end
