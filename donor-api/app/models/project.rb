class Project < ApplicationRecord
  has_many :photos
  has_one :project_type
end
