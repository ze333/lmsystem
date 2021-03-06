﻿using System.Collections.Generic;
using Application.Core.Data;
using LMPlatform.Models;

namespace Application.Infrastructure.LecturerManagement
{
    public interface ILecturerManagementService
    {
        Lecturer GetLecturer(int userId);

        List<Lecturer> GetLecturers();

        IPageableList<Lecturer> GetLecturersPageable(string searchString = null, IPageInfo pageInfo = null, IEnumerable<ISortCriteria> sortCriterias = null);

        Lecturer Save(Lecturer lecturer);

        Lecturer UpdateLecturer(Lecturer lecturer);

	    List<string> GetLecturesScheduleVisitings(int subjectId);

	    List<List<string>> GetLecturesScheduleMarks(int subjectId, int groupId);

        bool DeleteLecturer(int id);
    }
}
