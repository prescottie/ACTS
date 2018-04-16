module Api::V1
  class ProjectsController < ApplicationController
    def index
      @projects = Project.all
      render json: @projects
    end

    def show
      @project = Project.includes(:photos, :project_types).find(params[:id])
    
    
      @photos = @project.photos
      
      render json: @project
    end
  end
end