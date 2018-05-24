class Project < ApplicationRecord
  has_many :photos
  belongs_to :project_type
end
