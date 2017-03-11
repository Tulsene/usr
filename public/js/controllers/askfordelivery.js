(function () {

	lnwebcli.controller("ModalAskForDeliveryCtrl", ["$scope", "$uibModalInstance", "defaults", "lncli", controller]);

	function controller ($scope, $uibModalInstance, defaults, lncli) {

		var $ctrl = this;

		$ctrl.spinner = 0;

		$ctrl.values = defaults;

		$ctrl.ok = function () {
			$ctrl.spinner++;
			lncli.askForDelivery($ctrl.values.amount).then(function(response) {
				console.log("AskForDelivery", response);
				lncli.sendPayment(response.data.payment_request).then(function(response) {
					$ctrl.spinner--;
					console.log("SendPayment", response);
					if (response.data.error) {
						if ($ctrl.isClosed) {
							lncli.alert(response.data.error);
						} else {
							$ctrl.warning = response.data.error;
						}
					} else {
						$ctrl.warning = null;
						$uibModalInstance.close($ctrl.values);
					}
				}, function (err) {
					$ctrl.spinner--;
					console.log(err);
					var errmsg = err.message || err.statusText;
					if ($ctrl.isClosed) {
						lncli.alert(errmsg);
					} else {
						$ctrl.warning = errmsg;
					}
				});
			}, function (err) {
				$ctrl.spinner--;
				console.log(err);
				var errmsg = err.message || err.statusText;
				if ($ctrl.isClosed) {
					lncli.alert(errmsg);
				} else {
					$ctrl.warning = errmsg;
				}
			});
		};


		$ctrl.cancel = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$ctrl.dismissAlert = function () {
			$ctrl.warning = null;
		};

		$scope.$on("modal.closing", function (event, reason, closed) {
			console.log("modal.closing: " + (closed ? "close" : "dismiss") + "(" + reason + ")");
			$ctrl.isClosed = true;
		});
	}
})();
