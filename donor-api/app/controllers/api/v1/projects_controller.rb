module Api::V1
  class ProjectsController < ApplicationController
    def index
      @projects = Project.all
      render json: @projects
    end

    def show
      @project = Project.includes(:photos, :project_type).find(params[:id])
      puts @project 
      @project2 = Project.find_by_sql(["SELECT * FROM projects JOIN project_types ON project_types.id = projects.project_type_id JOIN photos ON projects.id = photos.project_id WHERE projects.id = ?", params[:id]])
      @photos = @project.photos
      
      render json: @project2
    end
  end
end