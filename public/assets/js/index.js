// var bcrypt = require("bcrypt");

$(document).ready(function () {
    $('#new-chore-btn').click(function () {
        console.log("new chore button clicked");
        event.preventDefault();
        $('#new-chore-modal').modal('show');
    });

    $('#edit-chore-btn').click(function () {
        event.preventDefault();
        $('#edit-chore-modal').modal('show');
    });

    $('#register-btn').click(function () {
        event.preventDefault();
        $('#new-user-modal').modal('show');
    });

    $('#login-btn').click(function () {
        event.preventDefault();
        $('#login-modal').modal('show');
    });

    $('#logout-btn').click(function () {
        event.preventDefault();
        $.ajax({
            url: "/logout"
        })
    });

    // $('#test-button').click(function () {
    //     event.preventDefault();
    //     res.redirect('success');
    // });

    // add chore to db //
    $("#submitNewChore").on("click", function () {
        event.preventDefault();
        var newChore = {
            username: $("#inputUserName").val().trim(),
            chore: $("#inputChore").val().trim(),
            overview: $("#inputDescription").val().trim(),
            due_date: $("#inputDate").val().trim()
        };
        console.log(newChore);
        api.newChore(JSON.stringify(newChore));
        // $('#new-chore-modal').modal('hide');
    });

    // add user to db //
    $("#submitNewUser").on("click", function () {
        event.preventDefault();
        console.log("new user button clicked");
        var newUser = {
            username: $("#username-register").val().trim(),
            email: $("#email-register").val().trim(),
            password: $("#password-register").val().trim(),
            passwordMatch: $("#passwordMatch-register").val().trim()
        };
        // console.log(newUser)
        api.newUser(JSON.stringify(newUser));
        // $('#new-user-modal').modal('hide');
    });

    // login user //
    $("#loginUser").on("click", function () {
        event.preventDefault();
        console.log("clicked login submit");
        var oldUser = {
            username: $("#usernameL").val().trim(),
            password: $("#passwordL").val().trim(),
        };
        console.log(oldUser);
        // console.log(password);
        api.loginUser(JSON.stringify(oldUser));
        // $('#login-modal').modal('hide');
    });

    // get data for editing chore //
    $(".edit-chore").on("click", function () {
        event.preventDefault();
        var chore_id = $(this).data("id");
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "api/getChore/" + chore_id,
            dataType: "json",
            type: "GET",
        }).then(function (result) {
            var username = result[0].username;
            var chore = result[0].chore;
            var overview = result[0].overview;
            var due_date = result[0].due_date;
            var chore_id = result[0].chore_id;
            $('#edit-chore-modal').modal('show')
            $("#edit-chore-modal #inputEditedUserName").val(username);
            $("#edit-chore-modal #inputEditedChore").val(chore);
            $("#edit-chore-modal #inputEditedDescription").val(overview);
            $("#edit-chore-modal #inputEditedDate").val(due_date);
            $("#edit-chore-modal #choreID").val(chore_id);
        });
    });

    // send edited chore to db //
    $("#submitEditedChore").on("click", function () {
        event.preventDefault();
        var data = {
            username: $("#inputEditedUserName").val().trim(),
            chore: $("#inputEditedChore").val().trim(),
            overview: $("#inputEditedDescription").val().trim(),
            due_date: $("#inputEditedDate").val().trim()
        };
        var chore_id = $("#choreID").val().trim();
        $('#edit-chore-modal').modal('hide')
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "api/choreEdits/" + chore_id,
            type: "PUT",
            data: data
        }).then(function (result) {
            location.reload();
        })
    });

    // change status of a chore to done / todo //
    $(".change-status").on("click", function (event) {
        var chore_id = $(this).data("id");
        var chore_state = $(this).data("chorestate");
        if (chore_state != 0) {
            new_chore_state = 0;
        } else {
            new_chore_state = 1;
        }
        var newChore_State = { chore_state: new_chore_state };
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "api/choreStatus/" + chore_id,
            type: "PUT",
            data: newChore_State
        }).then(function (result) {
            location.reload();
        })
    });

    // delete a chore // 
    $(".delete-chore").on("click", function (event) {
        var chore_id = $(this).data("id");
        var result = confirm("Want to delete chore # " + chore_id + "?");
        if (result) {
            $.ajax({
                url: "choreDelete/" + chore_id,
                type: "DELETE"
            }).then(function (response) {
                console.log(response);
                location.reload();
            })
        };
    });

    // User chore list // 
    $(".user-chores").on("click", function (event) {
        event.preventDefault();
        // $("#main-container").empty();
        var username = $(this).data("name");
        window.location.assign("http://localhost:8080/chores/" + username);
    });

    // All chore list // 
    $(".all-chores").on("click", function (event) {
        event.preventDefault();
        $("#main-container").empty();
        // var username = $(this).data("name");
        window.location.assign("/");
    });

    var api = {
        newChore: function (newChore) {
            return $.ajax({
                headers: { "Content-type": "application/json" },
                url: "api/newChore",
                type: "POST",
                data: newChore
            }).then(function (response) {
                location.reload();
            })
        },
        newUser: function (newUser) {
            console.log(newUser)
            return $.ajax({
                headers: { "Content-type": "application/json" },
                url: "api/newUser",
                type: "POST",
                data: newUser
            }).then(function (response) {
            })
        },
        loginUser: function (oldUser) {
            console.log("login sequence fired")
            return $.ajax({
                headers: { "Content-type": "application/json" },
                url: "login",
                type: "POST",
                data: oldUser
            }).then(function (response) {
                console.log(response)
            })
        },
        getChore: function (chore_id) {
            return $.ajax({
                headers: { "Content-type": "application/json" },
                url: "api/getChore/" + chore_id,
                type: "GET"
            })
        },
        newChoreStatus: function (newChore_State, chore_id) {
            return $.ajax({
                headers: { "Content-type": "application/json" },
                url: "api/choreStatus/" + chore_id,
                type: "PUT",
                data: newChore_State
            })
        }
    };
});













