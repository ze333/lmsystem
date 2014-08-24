﻿angular
    .module('dpApp.ctrl.visitStats', ['ngTable', 'ngResource'])
    .controller('visitStatsCtrl', [
        '$scope',
        '$modal',
        'ngTableParams',
        '$resource',
        '$location',
        function ($scope, $modal, ngTableParams, $resource, $location) {

            $scope.setTitle("Статистика посещения консультаций");

            $scope.forms = {};

            var dpConsultations = $resource('api/DipomProjectConsultation');
            var dpConsultationDates = $resource('api/DiplomProjectConsultationDate');

            $scope.consultations = [];

            $scope.getConsultationMark = function (student, consultationDateId) {

                var results = student.DipomProjectConsultationMarks;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].ConsultationDateId == consultationDateId) {
                        return results[i];
                    }
                }
                return {
                    ConsultationDateId: consultationDateId,
                    StudentId: student.Id
                };
            };


            $scope.saveConsultationMark = function (consultationMark, newValue) {

                if (newValue && (isNaN(newValue, 10) || newValue < 1 || newValue > 10)) return "Введите число от 1 до 10!";

                consultationMark.Mark = newValue;

                dpConsultations.save(consultationMark)
                    .$promise.then(function (data, status, headers, config) {
                        $scope.tableParams.reload();
                        alertify.success('Оценка успешно сохранена.');
                    }, $scope.handleError);
                return false;
            };


            $scope.deleteConsultationDate = function (id) {
                bootbox.confirm({
                    title: "Удаление",
                    message: "Вы действительно хотите удалить дату?",
                    callback: function (isConfirmed) {
                        if (isConfirmed) {
                            dpConsultationDates.delete({ id: id }).$promise.then(function () {
                                $scope.tableParams.reload();
                                alertify.success("Дата успешно удалена.");
                            }, $scope.handleError);
                        }
                    },
                    buttons: {
                        'cancel': {
                            label: 'Отмена',
                            className: 'btn btn-primary btn-sm'
                        },
                        'confirm': {
                            label: 'Удалить',
                            className: 'btn btn-primary btn-sm',
                        }
                    },
                });
            };

            $scope.addConsultationDate = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/Dp/ConsultationDate',
                    controller: editConsultationDateController,
                    keyboard: false,
                    scope: $scope
                });

                modalInstance.result.then(function (result) {
                    $scope.tableParams.reload();
                });
            };

            var editConsultationDateController = function ($modalInstance) {

                $scope.submitted = false;
                var now = new Date();
                $scope.consultation = {
                    date: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
                };

                $scope.saveConsultationDate = function () {
                    $scope.submitted = true;
                    if ($scope.forms.consultationDate.date.$error.required) return;

                    dpConsultationDates.save($scope.consultation.date)
                    .$promise.then(function () {
                        $scope.tableParams.reload();
                        alertify.success('Консультация успешно добавлена.');
                    }, $scope.handleError);

                    $modalInstance.close();
                };

                $scope.closeDialog = function () {
                    $modalInstance.close();
                };
            };


            $scope.tableParams = new ngTableParams(
                angular.extend({
                    page: 1,
                    count: 10
                }, $location.search()), {
                    total: 0,
                    getData: function ($defer, params) {
                        $location.search(params.url());
                        dpConsultations.get(params.url(),
                            function (data) {
                                $defer.resolve(data.Students.Items);
                                params.total(data.Students.Total);
                                $scope.consultations = data.DipomProjectConsultationDates;
                            });
                    }
                });
        }]);