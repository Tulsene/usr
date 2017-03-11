(function () {

	lnwebcli.controller("UserCtrl", ["$scope", "$timeout", "$uibModal", "lncli", "config", controller]);

	function controller($scope, $timeout, $uibModal, lncli, config) {

		$scope.spinner = 0;
		$scope.nextRefresh = null;

		$scope.refresh = function() {
			$scope.spinner++;
			$scope.updateNextRefresh();
			$scope.spinner--;
		}

		$scope.updateNextRefresh = function () {
			$timeout.cancel($scope.nextRefresh);
			$scope.nextRefresh = $timeout($scope.refresh,
				lncli.getConfigValue(config.keys.AUTO_REFRESH, config.defaults.AUTO_REFRESH));
		}

		$scope.askForDelivery = function() {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "askfordelivery-modal-title",
				ariaDescribedBy: "askfordelivery-modal-body",
				templateUrl: "templates/partials/askfordelivery.html",
				controller: "ModalAskForDeliveryCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					defaults: function () {
						return {
							amount: "1"
						};
					}
				}
			});

			modalInstance.rendered.then(function() {
				$("#askfordelivery-amount").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("values", values);
				$scope.refresh();
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});

		};

		$scope.refresh();

	}

})();
