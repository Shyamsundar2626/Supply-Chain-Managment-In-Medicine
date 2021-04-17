App = {
    web3Provider: null,
    contracts: {},
    batchno: null,
    medicineName: null,
    dosage: null,
    mfgdate: null,
    expdate: null,
    emptyAddress: "0x0000000000000000000000000000000000000000",
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x651B7E7fc4E1D673110764b35fffF0CB989b6D0A",
    originManufacturerID: "0x651B7E7fc4E1D673110764b35fffF0CB989b6D0A",
    FactoryName: null,
    distributorID: "0x015f9674BC986c5a37B796A44c3a5223b9E2D973",
    userID: "0x015f9674BC986c5a37B796A44c3a5223b9E2D973",

    init: async function() {
        $.getJSON('../../build/contracts/main.json', function() {
            App.batchno = $("#batchno").val();
            App.medicineName = $("#medicineName").val();
            App.dosage = $("#dosage").val();
            //App.ownerID = $("#ownerID").val();
            //App.originManufacturerID = $("#originManufacturerID").val();
            App.FactoryName = $("#FactoryName").val();
            App.mfgdate = $("#mfgdate").val();
            App.expdate = $("#expdate").val();
            //App.distributorID = $("#distributorID").val();
            //App.userID = $("#userID").val();

            console.log(
                App.batchno,
                App.medicineName,
                App.dosage,
                //App.ownerID, 
                //App.originManufacturerID, 
                App.FactoryName,
                App.mfgdate,
                App.expdate,
                //App.distributorID,  
                //App.userID

            );
        });
        return await App.initWeb3();
    },
    initWeb3: async function() {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.ethereum;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetamaskAccountID();

        return App.initmain();
    },

    getMetamaskAccountID: function() {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:', err);
                return;
            }
            console.log('getMetamaskID:', res);
            App.metamaskAccountID = res[0];

        })
    },
    initmain: function() {
        /// Source the truffle compiled smart contr 
        var jsonmain = '../../build/contracts/main.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonmain, function(message) {
            console.log('message', message);
            var mainArtifact = message;
            App.contracts.main = TruffleContract(mainArtifact);
            App.contracts.main.setProvider(App.web3Provider);

            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetamaskAccountID();

        var processId = parseInt($(event.target).data('id'));

        switch (processId) {
            case 1:
                return await App.makeMedicine(event);
                break;

            case 2:
                return await App.packMedicine(event);
                break;
            case 3:
                return await App.receiveMedicine(event);
                break;
            case 4:
                return await App.fetchMedicineBufferOne(event);
                break;
            case 5:
                return await App.fetchMedicineBufferTwo(event);
                break;
        }
        console.log('processId', processId);
    },

    makeMedicine: function(event) {
        //event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.contracts.main.deployed().then(function(result) {
            return result.makeMedicine(
                console.log(App.batchno),
                console.log(App.medicineName),
                console.log(App.dosage),
                console.log(App.FactoryName),
                console.log(App.mfgdate),
                console.log(App.expdate),
                console.log(App.metamaskAccountID),
                console.log(App.ownerID),
                console.log(App.originManufacturerID),
                console.log(App.distributorID),
                console.log(App.userID),
            );
        }).then(function(result) {
            $("#medicines").html(result);
            console.log('makeMedicine', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packMedicine: function(event) {
        //event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));

        App.contracts.main.deployed().then(function(instance) {
            return instance.packMedicine(App.batchno, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-medicine").text(result);
            console.log('packMedicine', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveMedicine: function(event) {
        //event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));

        App.contracts.main.deployed().then(function(instance) {
            return instance.receiveMedicine(App.batchno, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-medicine").text(result);
            console.log('receiveMedicine', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },


    fetchMedicineBufferOne: function(event) {
        //event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        App.batchno = $('#batchno').val();
        console.log('batchno', App.batchno);

        App.contracts.main.deployed().then(function(instance) {
            return instance.fetchMedicineBufferOne(App.batchno);
        }).then(function(result) {
            $("#ftc-medicine").text(result);
            console.log('fetchMedicineBufferOne', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchMedicineBufferTwo: function() {
        //event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));

        App.contracts.main.deployed().then(function(instance) {
            return instance.fetchMedicineBufferTwo.call(App.batchno);
        }).then(function(result) {
            $("#ftc-medicine").text(result);
            console.log('fetchMedicineBufferTwo', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function() {
        if (typeof App.contracts.main.currentProvider.sendAsync !== "function") {
            App.contracts.main.currentProvider.sendAsync = function() {
                return App.contracts.main.currentProvider.send.apply(
                    App.contracts.main.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.main.deployed().then(function(instance) {
            var events = instance.allEvents(function(err, log) {
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function(err) {
            console.log(err.message);
        });

    }
};

(function() {
    (window).load(function() {
        App.init();
    });
});