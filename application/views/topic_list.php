<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>

<table class="topic-table">
    <tr>
        <th>id</th><th>Name</th><th>Creation Date</th><th>Last message</th><th>User Name</th>
    </tr>
    <?php foreach ($topics as $row): ?>
        <tr>
            <td><?= $row['id'] ?></td><td><a href="#"><?= $row['name'] ?></a></td><td><?= $row['creation_date'] ?></td><td><?= $row['last_mess_date'] ?></td><td><?= $row['nickname'] ?></td>
        </tr>
    <?php endforeach; ?>
</table>
