<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<h3>Users:</h3>
<table class="topic-table">
    <tr>
        <th>id</th><th>First Name</th><th>Last name</th><th>email</th><th>nickname</th><th>password</th><th>topic count</th>
    </tr>
    <?php foreach ($users as $row): ?>
        <tr>
            <td><?= $row['id'] ?></td><td><?= $row['first_name'] ?></td><td><?= $row['last_name'] ?></td><td><?= $row['email'] ?></td><td><?= $row['nickname'] ?></td><td><?= $row['password'] ?></td><td><?= $row['topic_count'] ?></td>
        </tr>
    <?php endforeach; ?>
</table>