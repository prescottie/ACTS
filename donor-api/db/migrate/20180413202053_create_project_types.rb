class CreateProjectTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :project_types do |t|
      t.string :project_type

      t.timestamps
    end
  end
end
