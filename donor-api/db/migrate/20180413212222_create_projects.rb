class CreateProjects < ActiveRecord::Migration[5.1]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :description
      t.boolean :status
      t.integer :type_id, foreign_key: true
      t.integer :population
      t.date :completion_date
      t.point :location

      t.timestamps
    end
  end
end
