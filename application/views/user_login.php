<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>

<form method="post" action="/users/login">
    <label>
        email:
        <input type="text" name="email">                        
    </label>
    <br/>
    <label>
        password:
        <input type="text" name="password">        
    </label>
    <br/>
    <input type="submit" value="Sign in"> 
    <a href="/users/register">Register</a>
    <?php if (!empty($message)) :?>
    <div class="error_message" >
        <p style="color:red;">
            <?=$message?>
        </p>
    </div>
    <?php endif;?>
</form>